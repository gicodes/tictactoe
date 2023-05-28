import { Poppins } from 'next/font/google';
import Header from '@/app/components/header';
import './globals.css'

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin']
});

export const metadata = {
  title: 'TicTacToe',
  description: "Play 'X and O' on p2p rooms",
  keywords: 'play, tictactoe, online, gaming, web, connection, XandO, rooms'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        <main className='container'>
          {children}
        </main>
      </body>
    </html>
  )
}