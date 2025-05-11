import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';

import Button from '../Button/Button';

import './ScrollToBottom.css';

const ScrollToBottom = ({ showScrollToBottom, scrollToBottom }) => {
    return (
        <div
        className={`scroll-to-bottom ${
          showScrollToBottom ? "visible" : "hidden"
        }`}
      >
        <Button id="scroll-to-bottom" ariaLabel="scroll to bottom" ariaLabelledby="scroll to bottom" variant="orange" onClick={scrollToBottom}>
          <ArrowDownwardOutlinedIcon />
        </Button>
      </div>
    )
}

export default ScrollToBottom