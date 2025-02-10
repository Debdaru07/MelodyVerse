import  { ReactNode } from 'react'
import SignupImage  from '../assets/Connect_verse_SVG.svg';
interface FormComponentProps {
  children: ReactNode;
}

function ContentComponent({ children }: FormComponentProps): ReactNode {
  return (
    <div className='w-full'>
        <div className='flex-col justify-center space-y-2 hidden md:block'>
            <img src={SignupImage} className='mx-auto text-center' alt="Description" height={30} width={30}/>
            {/* <p className='text-3xl font-semibold font-serif text-center'>{title}</p> */}
        </div>

        {children}
    </div>
  )
}

export default ContentComponent