var fs = require('fs');

fs.open('../speechAssets/customSlotTypes/LIST_OF_STAGES', 'w', function(err, fd) {
    if(err) {
      throw 'error opening file: ' + err;
    }

    require('../src/resources/stages.json').map(function(stage) {
        return stage.name;
    }).forEach(function(stageName) {
        fs.write(fd, stageName + '\n', function(err) {
          if(err) {
            throw 'error writing file: ' + err;
          }
        })
    });

    fs.close(fd);

})
