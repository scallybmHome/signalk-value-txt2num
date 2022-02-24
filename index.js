/*
 * 0.4.2 updated description fields
 * 
 * Copyright 2022 Brian Scally <scallybm@gmail.com>
 *
 * Licensed under the MIT license
 *

 */

module.exports = function(app) {
  var plugin = {};
  var unsubscribes = []
  
  function mapValues(mappings, signalKDelta, key, source) {
    signalKDelta.forEach(pathValue => {
      //app.debug('::mapValues:: %s %s %s %s', key, pathValue, source, mappings)
      mappings.forEach((mapping, index, array) => {
        if (
            pathValue.path
            && (pathValue.path + '.').startsWith(mapping.path + '.')
            && (mapping.source.includes(mapping.source))
        ) {
          app.debug('::mapValues.1::\r\n\t\tDeltaPath  : %s\r\n\t\tDeltaValue : %s\r\n\t\tDataSource: %s', pathValue.path, pathValue.value, source)
          let outputNum = 0xff;
          if (typeof pathValue.value === 'string' || pathValue.value instanceof String){
            app.debug('::mapValues.2:: It is not a JSON');
            array[index].pair.forEach( (couple, idx) => {
              if (pathValue.value == array[index].pair[idx].string){
                outputNum = array[index].pair[idx].number;
              }
            })
          } else if (pathValue.value.hasOwnProperty(mapping.leafKey) && (typeof pathValue.value[mapping.leafKey] === 'string' || pathValue.value[mapping.leafKey] instanceof String)){
            app.debug('::mapValues.4:: Found key - %s', mapping.leafKey);
            array[index].pair.forEach( (couple, idx) => {
              app.debug(array[index].pair[idx].string);
              if (pathValue.value[mapping.leafKey] == array[index].pair[idx].string){
                outputNum = array[index].pair[idx].number;
              }
            })
          }
          
          app.handleMessage(plugin.id, {
            updates: [
              {
                values: [{
                  path: mapping.path+"Number",
                  value: outputNum
                }]
              }]
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
              default: 'yden'
            },
            leafKey: {
              type: 'string',
              title: 'Leaf key',
              description: 'When the value is a JSON enter the keyword (case sensitive)',
              default: ''
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
