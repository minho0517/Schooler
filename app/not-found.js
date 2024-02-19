import Link from 'next/link'
import IntroImg from "@/public/image/schooler-logo-icon.png";
import Image from 'next/image';
 
export default function NotFound() {
  return (
    <div className='errorPage'>
      <div className='errorStatus'>
        <h1 className='errorNum'>4</h1>
        <Image className='errorLogo' alt='logo' src={IntroImg}></Image>
        <h1 className='errorNum'>4</h1>
      </div>
      <h2 className='errorTitle'>존재하지 않는 페이지입니다</h2>
      <p className='errorDescription'>클릭하신 링크가 잘못되었거나 페이지가 삭제되었습니다</p>
      <Link className='errorLink' href={'/'}>홈으로 돌아가기</Link>
    </div>
  )
}