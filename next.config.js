const { withFaust } = require("@faustjs/next");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: ".*\\.js\\.wpenginepowered.com",
          },
        ],
        permanent: true,
        destination: `${process.env.NORMALIZED_URL}/:path*`,
      },
    ];
  },
});
