import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';

import './ScrollToBottom.css';

import Button from '../Button/Button';

const ScrollToBottom = ({ showScrollToBottom, scrollToBottom }) => {
    return (
        <div
        className={`scroll-to-bottom ${
          showScrollToBottom ? "visible" : "hidden"
        }`}
      >
        <Button variant="orange" onClick={scrollToBottom}>
          <ArrowDownwardOutlinedIcon />
        </Button>
      </div>
    )
}

export default ScrollToBottom