/*
 * 0.3.2 updated description fields
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
      mappings.forEach(mapping => {
        if (
            pathValue.path
            && (pathValue.path + '.').startsWith(mapping.path + '.')
            && (mapping.source.contains(mapping.source))
        ) {
          //app.debug('%s %s from %s to %s', key, pathValue.path, newPath)
          mappings.pair.forEach( pair => {
            if (pathValue.value == pair.string){
              app.handleMessage(plugin.id, {
              updates: [
                {
                  values: [{
                    path: mapping.path,
                    value: pair.number
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
        items: {
          type: "object",
          required: [ 'path', 'pair' ],
          properties: {
            path: {
              type: 'string',
              title: 'Path',
              description: 'The full Signal K path to map',
              default: 'electrical.switches.bank.0.1'
            },
            source: {
              type: 'string',
              title: 'Source contians',
              description: 'Source contains this keyword (case sensitive)',
              default: 'YDEN'
            },
            pair: {
              type: "array",
              title: "pairs",
              items:{
                type: "object",
                required: ['string', 'number' ],
                properties: {
                  string: {
                    type: 'string',
                    title: 'string to map',
                    description: 'The string to map from. (case sensitive)',
                    default: 'OK'
                  },
                  number: {
                    type: 'integer',
                    title: 'map to number',
                    description: 'The number to map to',
                    default: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return plugin;
}
