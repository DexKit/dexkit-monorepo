import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Search from "@mui/icons-material/Search";
import {
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useCollection } from "../hooks/collection";

interface Props {
  address?: string;
  chainId?: number;
}

interface TraitPropsDetails {
  traits: any;
  filterTraits: any;
  setFilterTraits: any;
  property: string;
}

function TraitDetails({
  traits,
  property,
  filterTraits,
  setFilterTraits,
}: TraitPropsDetails) {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [search, setSearch] = useState<string>();

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const filteredProperties = useMemo(() => {
    if (search) {
      return Object.keys(traits[property]).filter(
        (a) => a.toLowerCase().indexOf(search.toLowerCase()) !== -1,
      );
    }

    return Object.keys(traits[property]);
  }, [search, traits[property]]);

  return (
    <>
      <TextField
        fullWidth
        size="small"
        type="search"
        value={search}
        onChange={handleChangeSearch}
        placeholder={formatMessage({
          id: "search",
          defaultMessage: "Search",
        })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <List sx={{ maxHeight: "400px", overflow: "auto" }}>
        {filteredProperties.map((value, key) => {
          const isChecked =
            filterTraits.findIndex(
              (v: any) => v.property === property && v.value === value,
            ) !== -1;
          return (
            <ListItem
              key={key}
              secondaryAction={
                <FormControlLabel
                  value="start"
                  checked={isChecked}
                  control={<Checkbox />}
                  onClick={() => {
                    const newTraits = [...filterTraits];
                    const indexProperty = newTraits.findIndex(
                      (v) => v.property === property && v.value === value,
                    );
                    if (indexProperty === -1) {
                      newTraits.push({
                        property: property,
                        value: value,
                      });
                    } else {
                      newTraits.splice(indexProperty, 1);
                    }
                    setFilterTraits(newTraits);
                    router.replace({
                      query: {
                        ...router.query,
                        traitsFilter: newTraits
                          .map((f) => `${f.property}.${f.value}`)
                          .join(","),
                      },
                    });
                  }}
                  label={
                    <Typography variant={"caption"}>
                      {traits[property][value]}
                    </Typography>
                  }
                  labelPlacement="start"
                />
              }
            >
              <ListItemText primary={value} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

export function CollectionTraits({ address, chainId }: Props) {
  const router = useRouter();
  const { data: collection } = useCollection(address as string, chainId);
  const [filterTraits, setFilterTraits] = useState<
    Array<{ property: string; value: string }>
  >([]);

  const queryFilterTraits = router.query?.traitsFilter as string;

  useEffect(() => {
    if (queryFilterTraits) {
      const properties = queryFilterTraits.split(",");
      setFilterTraits(
        properties.map((p) => {
          return { property: p.split(".")[0], value: p.split(".")[1] };
        }),
      );
    } else {
      setFilterTraits([]);
    }
  }, [queryFilterTraits]);

  if (!collection?.traitCounts) {
    return null;
  }
  const traits = collection.traitCounts as any;
  const properties = Object.keys(traits);

  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      {properties.map((p, k) => {
        return (
          <Accordion key={k}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="traits"
              id="traits-display"
            >
              <Typography>{p}</Typography>
              <Typography
                variant={"caption"}
                sx={{ color: "text.secondary", pl: 1 }}
              >
                {Object.keys(traits[p]).length || 0}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TraitDetails
                traits={traits}
                property={p}
                filterTraits={filterTraits}
                setFilterTraits={setFilterTraits}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
