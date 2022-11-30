import { useState, useRef, useEffect, RefObject } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import styles from './VideoChat.module.scss';

interface VideoChatProps {
  startCall: ({
    isCaller, 
    id,
    friendId, 
    config
  }: {
    isCaller: boolean,
    id: string, 
    friendId: string, 
    config: {
      audio: boolean, 
      video: boolean
    }
  }) => void,
  id: string,
  localSrc: MediaStream | null,
  remoteSrc: MediaStream | null,
}

const VideoChat = ({startCall, id, localSrc, remoteSrc}: VideoChatProps): JSX.Element => {
  const [friendId, setFriendId] = useState<string>('');
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideo.current && localSrc) {
      localVideo.current.srcObject = localSrc;
    }

    if (remoteVideo.current && remoteSrc) {
      remoteVideo.current.srcObject = remoteSrc;
    }
  }, [localSrc, remoteSrc]);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setFriendId(newValue);
  }

  function onInputKeyUp(evt: React.KeyboardEvent<HTMLElement>) {
    const { key } = evt;
    if (key === 'Enter') {
      initCall();
    }
  };

  function initCall() {
    if (!friendId) {
      return;
    }

    const config = { audio: false, video: true };
    
    startCall({isCaller: true, id, friendId, config});
  }

  return (
    <div className={styles.root}>
      <Typography>Your id: {id}</Typography>
      <div className={styles.videoControls}>
        <div className={styles.chatInputWrapper}>
          <TextField
            label='id пользователя для звонка'
            variant='outlined'
            size='small'
            onChange={onInputChange}
            onKeyUp={onInputKeyUp}
            value={friendId}
          />
        </div>
        <Button variant='contained' onClick={initCall}>Call</Button>
      </div>
      <div className={styles.videos}>
        <div className={styles.videoWrapper}>
          <video id="localVideo" ref={localVideo} autoPlay></video>
        </div>
        <div className={styles.videoWrapper}>
          <video id="remoteVideo" ref={remoteVideo} autoPlay></video>
        </div>
      </div>
    </div>
  )
}

export default VideoChat;