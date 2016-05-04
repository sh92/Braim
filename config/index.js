var configValue = require('./config');

module.exports = {
    getDbConnectionString: function () {
        return "mongodb://"+configValue.uname+":"+configValue.pwd+"@ds013162.mlab.com:13162/ideadb";
    }
}