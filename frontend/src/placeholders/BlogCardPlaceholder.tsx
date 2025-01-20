

export default function BlogCardPlaceholder() {
  return (
    <div className='w-[350px] h-[400px] bg-white shadow-[0px_24px_50px_rgba(0,0,0,.1)] rounded-[15px] p-[25px] flex flex-col gap-[25px]'>
    <div className='w-full h-[50%]  rounded-[15px] bg-gray-100 animate-pulse' ></div>
    <div className='w-full h-[40%] flex flex-col gap-[15px] '>
        <div className='h-[25px] w-full bg-gray-100 rounded-full animate-pulse'></div>
        <div className='h-[20px] w-[30%] bg-gray-100 rounded-full animate-pulse'></div>
        <div className='h-[10px] w-[100%] bg-gray-100 rounded-full animate-pulse'></div>
        <div className='h-[10px] w-[60%] bg-gray-100 rounded-full animate-pulse'></div>
    </div>
    <div className='h-[10%] w-full '>

    </div>
</div>
  )
}
