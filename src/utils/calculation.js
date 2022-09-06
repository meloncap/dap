export const numberWithCommas = (x, decimal=0) => {
    if(x > 100000000000) {
        return x.toExponential(4)    
    }
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
    
    if(parts[1] && decimal) {
        parts[1] = parts[1].slice(0, decimal);
    }
    if(Number(parts[1]) !== 0)
        return parts.join(".");
    else return parts[0]
}

export const shortAddr = (addr, len=5) => {
    var firPart = addr.slice(0, len);
    var secondPart = addr.slice(addr.length - 4, addr.length);
    return firPart.concat("...", secondPart);
}

export const toFixed = (x) => {
    if (Math.abs(x) < 1.0) {
      let e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = Math.round(x * 100) / 100;
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x = Math.round(x * 100) / 100;
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
}

export const displayDays = (timeLimit) => {
    const day = (~~(timeLimit / (24 * 3600))).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    const hour = (~~(timeLimit / 3600) % 24).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    const minute = (~~(timeLimit / 60) % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    const second = (~~(timeLimit % 60)).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    return {day, hour,minute, second}
}

export const roundWithPrecision = (num, precision) => {
    var multiplier = Math.pow(10, precision);
    return Math.round( num * multiplier ) / multiplier;
}

export function subtractDates(numOfDate, date = new Date()) {
    date.setDate(date.getDate() - numOfDate);
    return date;
}

export function getDateFormat(date) {
    let year = date.getFullYear();
    let mon = date.getMonth()+1 < 10 ? "0"+ (date.getMonth()+1) : (date.getMonth()+1)
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return {year, mon, day, stringDate: `${year}-${mon}-${day}`}
}

export function ExpToNumber(number) {
    var data = String(number).split(/[eE]/);
    if (data.length === 1) return data[0];
  
    var z = '',
      sign = number < 0 ? '-' : '',
      str = data[0].replace('.', ''),
      mag = Number(data[1]) + 1;
  
    if (mag < 0) {
      z = sign + '0.';
      while (mag++) z += '0';
      return z + str.replace(/^-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
  }