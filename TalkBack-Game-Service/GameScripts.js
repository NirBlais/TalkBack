

    const RollForStart = () =>{
      const arr =  [Math.floor(Math.random() * 6 + 1),Math.floor(Math.random() * 6 + 1)]
      if(arr[0]===arr[1]) return RollForStart()
      return arr
    }
    module.exports = RollForStart;

