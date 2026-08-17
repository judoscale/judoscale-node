export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light dark' />
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.cyan.min.css' />
        <title>Judoscale sample app</title>
      </head>
      <body>
        <main className='container'>{children}</main>
      </body>
    </html>
  )
}
