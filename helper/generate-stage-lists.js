const fs = require('fs');
const api = require('../src/ura-api-aseag');
const uniqBy = require('lodash.uniqby');
const sortBy = require('lodash.sortby');

const aachenPrefixRegex = /(^aachen\s)/;
const strRegex = /(str\.?($|\s))/;
const sanktRegex = /^st\.\s/;
const abzwRegex = /abzw\.\s/;
const plRegex = /pl\./;
const alsdRegex = /alsdf\./;
const eschwRegex = /eschw\./;
const albRegex = /^alb\.?/;

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join(''|''),'gi');

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

api.getStages(function(err, stages) {
  if (err) {
    console.error(err);
    proces.exit(1);
  } else {

    const sortedStages = sortBy(stages, (stage) => stage.name);
    const filteredStages = sortedStages.filter((stage) => {
        return stage.name.trim() !== '.';
    });

    const lowerCaseStages = filteredStages.map((stage) => {
      stage.name = stage.name.toLowerCase();
      return stage;
    });

    const strippedStages = lowerCaseStages.map((stage) => {
      stage.name = stage.name.replace(aachenPrefixRegex,'');
      stage.name = stage.name.replace(strRegex, 'straße ');
      stage.name = stage.name.replace(sanktRegex, 'sankt ');
      stage.name = stage.name.replace(abzwRegex, 'abzweig ');
      stage.name = stage.name.replace(plRegex, 'platz');
      stage.name = stage.name.replace(alsdRegex, 'alsdRegex');
      stage.name = stage.name.replace(eschwRegex, 'eschweiler');
      stage.name = stage.name.replace(albRegex, 'albert');

      stage.name = stage.name.trim();
      return stage;
    });

    const uniqueStages = uniqBy(filteredStages, (stage) => stage.name );

    fs.open('./speechAssets/customSlotTypes/LIST_OF_STAGES', 'w', function(err, fd) {
      if (err) {
        throw 'error opening file: ' + err;
      }

      uniqueStages.map((stage) => stage.name).forEach((stageName) => {
        fs.write(fd, stageName.toLowerCase() + '\n', function(err) {
          if (err) {
            throw 'error writing file: ' + err;
          }
        });
      });

      fs.close(fd);

    });

    fs.open('./src/resources/stages.json', 'w', function(err, fd) {
      if (err) {
        throw 'error opening file: ' + err;
      }

      let jsonStages = uniqueStages.map(function(stage) {
        let obj = stage.toObject();
        obj.name = obj.name.toLowerCase();
        return obj;
      });

      fs.write(fd, JSON.stringify(jsonStages), function(err) {
        if (err) {
          throw 'error writing file: ' + err;
        }
      });

      fs.close(fd);
    });

  }
});
