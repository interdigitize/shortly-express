const parseCookies = (req, res, next) => {
  var cookies = req.headers.cookie;
  if (cookies) {
    cookiesArr = cookies.split('; ').map(cookie => cookie.split('='));
    var obj = {};
    cookiesArr.forEach(cookie => obj[cookie[0]] = cookie[1]);
    req.cookies = obj;
  }
  next();
};

module.exports = parseCookies;

