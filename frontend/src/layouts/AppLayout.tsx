import Navbar from '../components/Navbar'


export default function AppLayout(props:any) {

  return (
    <>
        <Navbar/>
        {props.children}
    </>
  )
}
