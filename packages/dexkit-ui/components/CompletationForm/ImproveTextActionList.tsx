import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CodeIcon from "@mui/icons-material/Code";
import RefreshIcon from "@mui/icons-material/Refresh";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

import NotesIcon from "@mui/icons-material/Notes";
import ShortTextIcon from "@mui/icons-material/ShortText";

import ImageIcon from "@mui/icons-material/Image";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { TextImproveAction } from "../../constants/ai";

export interface ImproveTextActionListProps {
  value?: string;
  disabled?: boolean;
  filteredActions?: TextImproveAction[];
  onChange: (value: string) => void;
}

export default function ImproveTextActionList({
  onChange,
  value,
  disabled,
  filteredActions,
}: ImproveTextActionListProps) {
  const handleClick = (action: string) => {
    return () => onChange(action);
  };

  const getDynamicContent = (action: string) => {
    switch (action) {
      case TextImproveAction.GENERATE:
        return {
          label: (
            <FormattedMessage
              id="generate.new.text"
              defaultMessage="Generate new text"
            />
          ),
          icon: <RefreshIcon />,
        };
      case TextImproveAction.IMPROVE_SPELLING:
        return {
          label: (
            <FormattedMessage
              id="fix.spelling.and.grammar"
              defaultMessage="Fix spelling and grammar"
            />
          ),
          icon: <SpellcheckIcon />,
        };
      case TextImproveAction.MAKE_SHORTER:
        return {
          label: (
            <FormattedMessage id="make.shorter" defaultMessage="Make shorter" />
          ),
          icon: <ShortTextIcon />,
        };
      case TextImproveAction.MAKE_LONGER:
        return {
          label: (
            <FormattedMessage id="make.longer" defaultMessage="Make longer" />
          ),
          icon: <NotesIcon />,
        };

      case TextImproveAction.IMPROVE_WRITING:
        return {
          label: (
            <FormattedMessage
              id="improve.writing"
              defaultMessage="Improve writing"
            />
          ),
          icon: <AutoAwesomeIcon />,
        };
      case TextImproveAction.GENERATE_IMAGE:
        return {
          label: (
            <FormattedMessage
              id="generate.image"
              defaultMessage="Generate image"
            />
          ),
          icon: <ImageIcon />,
        };

      case TextImproveAction.GENERATE_CODE:
      default:
        return {
          label: (
            <FormattedMessage
              id="generate.code"
              defaultMessage="Generate code"
            />
          ),
          icon: <CodeIcon />,
        };
    }
  };

  return (
    <List disablePadding>
      {(filteredActions || Object.values(TextImproveAction)).map((action) => {
        return (
          <ListItemButton
            key={action}
            disabled={disabled}
            selected={value === action}
            onClick={handleClick(action)}
          >
            <ListItemIcon>{getDynamicContent(action).icon}</ListItemIcon>
            <ListItemText primary={getDynamicContent(action).label} />
          </ListItemButton>
        );
      })}
    </List>
  );
}

// <List disablePadding>
//       <ListItemButton
//         disabled={disabled}
//         selected={value === TextImproveAction.GENERATE}
//         onClick={handleClick(TextImproveAction.GENERATE)}
//       >
//         <ListItemIcon>
//           <RefreshIcon />
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <FormattedMessage
//               id="generate.new.text"
//               defaultMessage="Generate new text"
//             />
//           }
//         />
//       </ListItemButton>
//       <ListItemButton
//         disabled={disabled}
//         selected={value === TextImproveAction.IMPROVE_WRITING}
//         onClick={handleClick(TextImproveAction.IMPROVE_WRITING)}
//       >
//         <ListItemIcon>
//           <AutoAwesomeIcon />
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <FormattedMessage
//               id="improve.writing"
//               defaultMessage="Improve writing"
//             />
//           }
//         />
//       </ListItemButton>
//       <ListItemButton
//         disabled={disabled}
//         selected={value === TextImproveAction.IMPROVE_SPELLING}
//         onClick={handleClick(TextImproveAction.IMPROVE_SPELLING)}
//       >
//         <ListItemIcon>
//           <SpellcheckIcon />
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <FormattedMessage
//               id="fix.spelling.and.grammar"
//               defaultMessage="Fix spelling and grammar"
//             />
//           }
//         />
//       </ListItemButton>
//       <ListItemButton
//         disabled={disabled}
//         selected={value === TextImproveAction.MAKE_SHORTER}
//         onClick={handleClick(TextImproveAction.MAKE_SHORTER)}
//       >
//         <ListItemIcon>
//           <ShortTextIcon />
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <FormattedMessage id="make.shorter" defaultMessage="Make shorter" />
//           }
//         />
//       </ListItemButton>
//       <ListItemButton
//         disabled={disabled}
//         selected={value === TextImproveAction.MAKE_LONGER}
//         onClick={handleClick(TextImproveAction.MAKE_LONGER)}
//       >
//         <ListItemIcon>
//           <NotesIcon />
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <FormattedMessage id="make.longer" defaultMessage="Make longer" />
//           }
//         />
//       </ListItemButton>
//       <ListItemButton
//         disabled={disabled}
//         selected={value === TextImproveAction.GENERATE_IMAGE}
//         onClick={handleClick(TextImproveAction.GENERATE_IMAGE)}
//       >
//         <ListItemIcon>
//           <ImageIcon />
//         </ListItemIcon>
//         <ListItemText
//           primary={
//             <FormattedMessage
//               id="generate.image"
//               defaultMessage="Generate image"
//             />
//           }
