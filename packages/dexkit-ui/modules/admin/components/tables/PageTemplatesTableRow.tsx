import { IconButton, TableCell, TableRow } from "@mui/material";
import { memo } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PageTemplateResponse } from "../../../whitelabel/types";

interface Props {
  pageTemplate: PageTemplateResponse;
  onMenu: (
    event: React.MouseEvent<HTMLElement>,
    config: PageTemplateResponse
  ) => void;
}

function PageTemplatesTableRow({ pageTemplate, onMenu }: Props) {
  return (
    <TableRow>
      <TableCell>{pageTemplate.id}</TableCell>
      <TableCell>{pageTemplate.title}</TableCell>
      <TableCell>{pageTemplate.description}</TableCell>
      <TableCell>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-haspopup="true"
          onClick={(e: any) => onMenu(e, pageTemplate)}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default memo(PageTemplatesTableRow);
