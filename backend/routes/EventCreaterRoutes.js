const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const converter = require('json-2-csv');

const EventCreator = require('../model/EventCreator');
const Event = require('../model/Event');
const User = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET_EVENT;
const JWT_EXPIRY_DURATION = '6h';

router.post('/register', (req, res) => {

  const id_token = req.header('Authorization').split(" ")[1];
  var decoded = jwt.decode(id_token);
  console.log(decoded);

  if (decoded == null) {
    var resp = { 'status': 'err', 'message': 'Error while decoding Token' };
    return res.status(500).json(resp);
  }

  if (decoded.email_verified === true && decoded.aud === process.env.GOOGLE_CLIENT_ID) {

    EventCreator.findOne({ email: decoded.email }, (err, obj) => {
      if (err) {
        return res.status(500).json({ 'status': 'err', 'message': err });
      }
      else {
        if (obj !== null) {
          console.log("Exist ", obj);
          const token = jwt.sign({
            id: obj._id,
            email: obj.email
          },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY_DURATION }
          );
          return res.status(202).json({ status: 'ok', data: token });
        }
        else {

          var eventCreator = new EventCreator({
            _id: new mongoose.Types.ObjectId(),
            email: decoded.email,
            username: decoded.name
          })

          eventCreator
            .save()
            .then(result => {
              console.log(result);
              const token = jwt.sign({
                id: result._id,
                email: result.email
              },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY_DURATION }
              );
              return res.status(201).json({ status: 'ok', data: token });
            })
            .catch(err => {
              return res.status(500).json({ 'status': 'err', 'message': err })
            });
        }
      }
    });
  }
});

router.post('/create-event', (req, res) => {

  const { event_name } = req.body;
  const jwt_token = req.header('Authorization').split(" ")[1];
  try {
    const eventCreator = jwt.verify(jwt_token, JWT_SECRET);
    const eventid = new mongoose.Types.ObjectId();

    const event_token = jwt.sign({
      event_id: eventid,
      creator_id: eventCreator.id,
    }, JWT_SECRET);

    const newEvent = new Event({
      _id: eventid,
      event_name: event_name,
      creator_id: eventCreator.id,
      token: event_token,
    });

    newEvent.save()
      .then(result => {
        return res.json({ status: "ok", message: result })
      })
      .catch(err => {
        console.log(err);
        res.json({ status: "error", message: err });
      });

  }
  catch (error) {
    console.log(error);
    return res.json({ status: error, message: "Token invalid or User does not exist" });
  }
});

router.get('/events', (req, res) => {

  const jwt_token = req.header('Authorization').split(" ")[1];

  jwt.verify(jwt_token, JWT_SECRET, (err, eventCreator) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ status: "error", message: err });
    }
    else {
      Event.find({ creator_id: eventCreator.id }, (error, objs) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: "error", message: error });
        }
        else {
          res.status(200).json({ length: objs.length, objects: objs });
        }
      });
    }
  });
});

router.post('/getUserData', (req, res) => {

  const jwt_token = req.header('Authorization').split(" ")[1];
  const { event_id } = req.body;

  jwt.verify(jwt_token, JWT_SECRET, (err, eventCreator) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ status: "error", message: err });
    }
    else {
      Event.findOne({ _id: event_id }).populate('creator_id').exec((err, obj) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ status: "error", message: err });
        }
        else {
          if (obj !== null) {
            if (obj.creator_id._id.toHexString() === eventCreator.id) {
              User.find({ event_id }, "-_id -verified -password -createdAt -updatedAt -event_id -__v").lean().exec((error, objs) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ status: "error", message: error });
                }
                else {
                  console.log(objs);

                  converter.json2csv(objs, (err, csv) => {
                    if (err) {
                      console.log(err);
                      return res.json({ status: "error", message: "Error sending csv" });
                    }
                    console.log(csv);
                    res.setHeader('Content-Type', 'text/csv');
                    res.attachment('data.csv');
                    return res.send(csv);
                  })

                }
              });
            }
            else {
              res.status(404).json({ status: "error", message: "You can not access data of this event" });
            }
          }
          else {
            res.status(500).json({ status: "error", message: "Could not find any event with this ID" });
          }
        }
      });
    }
  });
});

module.exports = router;
