const Room  = require('../../../schemas/room');
const Hotel  = require('../../../schemas/hotel');

// return room by room_id
exports.getRoom = ({room_id}) => {
  return new Promise((resolve, reject) => {
    if(!room_id) reject('room_id param is missing');

    Room.findById(room_id).populate('user').populate('hotel_id').exec((err, room) => {
      if(err) reject(err.message);
      else if(!room) reject(`Room: ${room_id} not exists`);
      resolve(room);
    });
  });
}

// return all rooms by hotel_id
exports.getAllRooms = ({hotel_id}) => {
  return new Promise((resolve, reject) => {
    if(!hotel_id) return reject('hotel_id param is missing');

    Hotel.findById(hotel_id).exec((err, hotel) => {
        if(err) return reject(err.message);
        else if(!hotel) return reject(`hotel: ${hotel_id} not exists`);

        Room.find({hotel: hotel_id}).select(`number`).sort('number').exec((err, rooms) => {
          if(err) return reject(err.message);
          resolve(rooms);
        });
    });
  });
}

// return all available rooms by hotel_id
exports.getAvailableRooms = ({hotel_id}) => {
  return new Promise((resolve, reject) => {
    if(!hotel_id) return reject('hotel_id param is missing');

    Hotel.findById(hotel_id).exec((err, hotel) => {
        if(err) return reject(err.message);
        else if(!hotel) return reject(`hotel: ${hotel_id} not exists`);

        Room.find({
          hotel: hotel_id,
          user: null
        }).select(`number`).sort('number').exec((err, rooms) => {
          if(err) return reject(err.message);

          resolve(rooms);
        });
    });
  });
}

// add rooms to hotel
exports.addRooms = ({hotel_id, min, max, exc}) => {
  return new Promise(async (resolve,reject) => {
    if(!hotel_id || !min || !max) return reject('hotel_id || min || max params are missing');
    console.log(hotel_id)
    let excArray = [];
    if(exc) excArray = exc.split(",");

    await Hotel.findById(hotel_id, (err, hotel) => {
      console.log(hotel)
      if(err) return reject(err.message);
      else if(!hotel) return reject(`hotel ${hotel_id} not exists`);
      var roomsSuccess = [];
      var roomsFail = [];
      for(let i=min; i<=max; i++){
        if(!excArray.includes(i.toString())) {  //only if room is NOT in excArray
          let newRoom = new Room({hotel: hotel_id, number: i});
          newRoom.save((err) => {
            if(err) //might ref not exists || (hotel, number) unique key already exists
              roomsFail.push({number: i, error: err.message});
            else
              roomsSuccess.push(newRoom);

            if(i==max)
              resolve({roomsSuccess, roomsFail});
          });
        }
      }
    });
  });
}

exports.checkIn = ({room_id, user_id}) => {
  return new Promise((resolve, reject) => {
    if(!room_id || !user_id) reject('room_id || user_id params are missing');

    Room.checkIn(room_id, user_id).then((room) => {
      resolve(room);
    }).catch((e) => {
      reject(e.message);
    });
  });
}

exports.checkOut = ({room_id, user_id}) => {
  return new Promise((resolve, reject)  => {
    if(!room_id || !user_id) reject('room_id || user_id params are missing');

    Room.checkOut(room_id, user_id).then(room => resolve(room)).catch(e => reject(e.message));
  });
}
