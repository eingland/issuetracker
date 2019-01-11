/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; 

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freecodecamp");
        var query = {project: project};
        if (req.query.issue_title) {
          query.issue_title = req.query.issue_title;
        }
        if (req.query.issue_text) {
          query.issue_text = req.query.issue_text;
        }
        if (req.query.created_by) {
          query.created_by = req.query.created_by;
        }
        if (req.query.assigned_to) {
          query.assigned_to = req.query.assigned_to;
        }
        if (req.query.status_text) {
          query.status_text = req.query.status_text;
        }
        if (req.query.status_text) {
          query.status_text = req.query.status_text;
        }
        if (req.query.created_on) {
          query.created_on = new Date(req.query.created_on);
        }
        if (req.query.updated_on) {
          query.updated_on = new Date(req.query.updated_on);
        }
        if (req.query.open) {
          query.open = req.query.open === 'true' ? true : false;
        }
        dbo.collection("issues").find(query).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
        });
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) throw err;
        if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
          var dbo = db.db("freecodecamp");
          dbo.createCollection("issues", function(err, res) {
            if (err) throw err;
            db.close();
          });
          var myobj = {issue_title: req.body.issue_title, 
                         issue_text: req.body.issue_text, 
                         created_by: req.body.created_by, 
                         assigned_to: req.body.assigned_to || "", 
                         status_text: req.body.status_text || "", 
                         created_on: new Date(), 
                         updated_on: new Date(), 
                         open: true,
                         project: project};
         dbo.collection("issues").insertOne(myobj, function(err, result) {
            if (err) throw err;
            db.close();
            res.json(result.ops[0]);
          });
        } else {
          res.json("required fields missing");                  
        }
      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      if (Object.keys(req.body).length === 0) {
        res.json("could not update"); 
      } else {
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
            if (err) throw err;
            var dbo = db.db("freecodecamp");
            var id = req.body.id;
            var collection = dbo.collection("issues")
            var newvalues = {};
          if (req.body != null) {
            if (req.body.issue_title) {
              newvalues.issue_title = req.body.issue_title;
            }
            if (req.body.issue_text) {
              newvalues.issue_text = req.body.issue_text;
            }
            if (req.body.created_by) {
              newvalues.created_by = req.body.created_by;
            }
            if (req.body.assigned_to) {
              newvalues.assigned_to = req.body.assigned_to;
            }
            if (req.body.status_text) {
              newvalues.status_text = req.body.status_text;
            }
            if (req.body.status_text) {
              newvalues.status_text = req.body.status_text;
            }
            if (req.body.created_on) {
              newvalues.created_on = new Date(req.body.created_on);
            }
            newvalues.updated_on = new Date();
            if (req.body.open) {
              newvalues.open = req.body.open === 'true' ? true : false;
            }
            collection.updateOne({ _id: new MongoClient.ObjectId(id) }, newvalues, function (err, results) {
                                    if (err) return res.json("could not update " + id);
                                    db.close();
                                    res.json("successfully updated");
            });
          } else {
           res.json("no fields sent"); 
          }
        });
      }
        
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if (req.body._id != null) {
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          if (err) throw err;
          var dbo = db.db("freecodecamp");
          var id = req.body._id;
          var collection = dbo.collection("issues")
          collection.deleteOne({ _id: new MongoClient.ObjectId(id) }, function (err, results) {
                                  if (err) return res.json("could not delete " + id);
                                  db.close();
                                  res.json("deleted " + id || "");
          });
        });
      } else {
        res.json('_id error'); 
      }
    })
    
};
