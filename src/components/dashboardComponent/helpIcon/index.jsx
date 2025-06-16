import useHelpVideoDialogStore from '@/store/useHelpVideoDialogStore';
import { Play } from 'lucide-react';
import './helpModelIcon.css';

const HelpModelIcon = ({ videoID }) => {
  const { openDialog } = useHelpVideoDialogStore();

  return (
    <div onClick={() => openDialog(videoID)} className='helpModelIcon'>
        <Play size={18} className='playIcon' />
        <p>help</p>
    </div>
  )
}

export default HelpModelIcon