/*
 * 0.3.4 updated description fields
 * 
 * Copyright 2022 Brian Scally <scallybm@gmail.com>
 *
 * Licensed under the MIT license
 *

 */

module.exports = function(app) {
  var plugin = {};
  var unsubscribes = []

  function mapValues(mappings, kps, key, source) {
    kps.forEach(pathValue => {
      app.debug('txt2num:: %s %s %s %s', key, pathValue, source, mappings)
      mappings.forEach((mapping, index, array) => {
        if (
            pathValue.path
            && (pathValue.path + '.').startsWith(mapping.path + '.')
            && (mapping.source.includes(mapping.source))
        ) {
          
          array[index].pair.forEach( (couple, idx) => {
            if (pathValue.value == array[index].pair[idx].string){
              app.handleMessage(plugin.id, {
              updates: [
                {
                  values: [{
                    path: mapping.path+"Number",
                    value: array[index].pair[idx].number
                  }]
                }]
              })
            }
          })
        }
      })
    })
  }

  plugin.start = function(props) {
    if ( props.mappings && props.mappings.length > 0 ) {
      app.registerDeltaInputHandler((delta, next) => {
        if ( delta.updates ) {
          delta.updates.forEach(update => {
            if ( update.values  ) {
              mapValues(props.mappings, update.values, 'value', update.$source)
            }
            if ( update.meta ) {
              mapValues(props.mappings, update.meta, 'meta', update.$source)
            }
          })
        }
        next(delta)
      })
    }
  }

  plugin.stop = function() {
    unsubscribes.forEach(f => f())
    unsubscribes = []
  }

  plugin.id = "signalk-value-txt2num"
  plugin.name = "value txt2number"
  plugin.description = "SignalK Node Server Plugin that maps text value strings to numberic values for easier plotting and control"

  plugin.schema = {
    type: "object",
    properties: {
      mappings: {
        type: "array",
        title: "Mappings",
