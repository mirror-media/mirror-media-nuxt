export default function ({ redirect }) {
  if (process.server) {
    redirect('/')
  }
}
