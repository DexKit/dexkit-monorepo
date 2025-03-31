import { Avatar, ButtonBase, styled } from '@mui/material';

const Img = styled('img')(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  borderRadius: '50%',
  background: theme.palette.background.paper,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
}));

const ImgButton = styled(ButtonBase)(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  borderRadius: '50%',
  fontWeight: 600,
}));

interface Props {
  image?: string;
  onClick?: () => void;
}

export default function ProfileImage({ image, onClick }: Props) {
  return (
    <ImgButton onClick={onClick}>
      {!image ? (
        <Avatar
          sx={(theme) => ({
            width: theme.spacing(8),
            height: theme.spacing(8),
          })}
        />
      ) : (
        <Img alt="Profile image" src={image} />
      )}
    </ImgButton>
  );
}
