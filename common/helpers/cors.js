const allow_domain = (origin) => {
    const app_domain = process.env.APP_DOMAIN;
    const domain = origin.split('/')[0];

    return domain != null && (!!domain.split(':')[0].endsWith(app_domain) || domain.split(':')[0] === 'localhost' || domain.split(':')[0] === '127.0.0.1');

}

exports.allow_domain = allow_domain;
exports.cors_delegate = function (req, callback) {
    let corsOptions;
    let allowed_domain = allow_domain(req.hostname);

    if (allowed_domain) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
