'use strict';
var sys = require("systeminformation")

/**
 * Aggregates all useful sys data into a returnable JSON
 * Note that we don't really use req here
 */
exports.getSystemSpecs = async function(req, res) {
  var data = {};
  
  console.log("Attempting to get system specs...")

  data.uptime =       getLastBootDate(res);
  data.temp   = await getCoreTemp(res);

  [ data.coreSpeeds,
    data.ramLoad ] = await Promise.all(
                             [ getCpuLoad(res),
                               getRamLoad(res) ]);

  console.log("All fetches made.");
  console.log("Uptime: " + data.uptime);
  console.log("Core temperature: " + data.temp);
  console.log("Core speeds: " + data.coreSpeeds);
  console.log("RAM left for use: " + data.ramLoad.avail + "/" + data.ramLoad.total);

  res.json(data);
}

// returns a JSON with status (personal func status) and lastBootDate
var getLastBootDate = function(res) {
  console.log("Fetching last boot date...");

  var date;
  try {
    date = sys.time().uptime;
  }
  catch(error) {
    res.send(error);
    
  }
  return date;
}

// Return a (presumably decimal-included) value containing the CPU temperature
var getCoreTemp = async function(res) {
  console.log("Fetching core temperature...");
  try {
    var temp = await sys.cpuTemperature();
    return temp;
  } catch(e) {
    res.send(e);
  }
}

/**
 * Returns CPU core speeds and min/max/avg.
 */
var getCpuLoad = async function(res) {
  console.log("Fetching CPU speeds...");

  try {
    var coreSpeeds = await sys.cpuCurrentspeed();
    return coreSpeeds;
  } catch(e) {
    res.send(e);
  }
}

/**
 * RAM LOAD: [
 *   total: # in bytes,
 *   avail: * in bytes
 */
var getRamLoad = async function(res) {
  console.log("Fetching RAM usage...");


  try {
    var fullMem = await sys.mem();
    return fullMem;
  } catch(e) {
    console.error("Could not fetch RAM data: " + e);
    res.send(e);
  }
}
