const axios = require('axios')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { program } = require('commander')
dotenv.config()

program
  .option('-i, --id <videoId>', 'Youtube Video ID')
  .parse(process.argv)

program.parse()

const main = async () => {
  const baseUrl = new URL(process.env.BASE_URL);
  const options = program.opts();
  baseUrl.pathname = `/summarize/${options.id}`;
  const token = jwt.sign(
    {
      type: "youtube",
      exp: Math.floor(Date.now() / 1000) + 30,
    },
    process.env.JWT_SECRET
  );
  return axios.get(baseUrl.toString(), { headers: { authorization: `Bearer ${token}` }})
}

main()
  .then((response) => {
    const { data: { summary, transcript }} = response
    console.log('Transcript:\n', transcript)
    console.log('\n')
    console.log('Summary:\n', summary)
  })
  .catch((error) => {
    console.error(error.message)
  })