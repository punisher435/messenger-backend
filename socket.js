
const socket = io => {
  io.on('connection', client => {
    console.log('New Connection');
  });
}
 
export default socket;