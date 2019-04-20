const Room  = require('../../../../schemas/room');

exports.addMissing = ({room_id, item, quantity}) => {
  return new Promise((resolve, reject) => {
    if(!room_id || !item || !quantity) return reject('room_id || item || quantity params are missing');
    const newMissing = {item,quantity};
    Room.findOneAndUpdate({_id: room_id}, {$push: {'room_service.missing_items': newMissing} }, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}

exports.completeMissing = ({room_id}) => {
  return new Promise((resolve, reject) => {
    if(!room_id) return reject('room_id param is missing');
    Room.findOneAndUpdate({_id: room_id}, {$set: {'room_service.missing_items': []} }, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}

exports.addMaintenance = ({room_id, desc}) => {
  return new Promise((resolve, reject) => {
    if(!room_id || !desc) return reject('room_id || desc params are missing');
    Room.findOneAndUpdate({_id: room_id}, {$push: {'room_service.maintenance': desc} }, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}

exports.completeMaintenance = ({room_id}) => {
  return new Promise((resolve, reject) => {
    if(!room_id) return reject('room_id param is missing');
    Room.findOneAndUpdate({_id: room_id}, {$set: {'room_service.maintenance': []} }, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}

exports.addAlarmClock = ({room_id, date, time}) => {
  return new Promise((resolve, reject) => {
    if(!room_id || !time || !date) return reject('room_id || date || time params are missing');
   
    const regexTime = RegExp('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');
    if(!Date.parse(date)) return reject("date param is illegal");
    else if(!regexTime.test(time)) return reject("time param is illegal. HH:MM format only");

    //const datetime = new Date(`${date}T${time}`);
    let datetime = new Date(date); 
    let timeArr = time.split(':');
    datetime.setHours(timeArr[0], timeArr[1]);

    Room.findOneAndUpdate({_id: room_id}, {'room_service.alarmClock': datetime}, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}

exports.completeAlarmClock = ({room_id}) => {
  return new Promise((resolve, reject) => {
    if(!room_id) return reject('room_id param is missing');
    Room.findOneAndUpdate({_id: room_id}, {'room_service.alarmClock': null}, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}

exports.setCleanable = ({room_id, value}) => {
  return new Promise((resolve, reject) => {
    if(!room_id || !value) return reject('room_id || value params are missing');
    else if(!(value=='true' || value=='false')) return reject("value param is not boolean");
    Room.findOneAndUpdate({_id: room_id}, {'room_service.isCleanable': value}, {new: true}).exec((err, room) => {
      if(err) return reject(err.message);
      else if(!room) return reject(`room ${room_id} is not exists`);
      resolve(room);
    });
  });
}
