
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className='w-full min-h-screen flex justify-center items-center text-center'>
      <div>
        <h1 className='text-[50px] font-bold'>OOPS it's a 404 page</h1>
        <h3 className='text-[30px] '>This page doesn't exist or at least now...</h3>
        <div className='w-full flex items-center justify-center pt-[15px]'>
          <Link to={'/'} className='bg-blue-500 rounded-full font-semibold transition-all text-white w-fit px-[25px] py-[10px] hover:tracking-widest cursor-pointer'>Go Back Home</Link>
        </div>
      </div>

    </div>
  )
}
