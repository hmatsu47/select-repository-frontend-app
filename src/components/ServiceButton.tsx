import Button from "@suid/material/Button";
import { fetchRepositories } from "../api/fetchRepositories";
import { fetchSetting } from "../api/fetchSetting";
import { service, setService } from "../signal";
import { ServiceItem } from "../type";

type Props = {
  serviceItem: ServiceItem;
};

export const ServiceButton = (props: Props) => {
  return (
    <Button
      variant={service() === props.serviceItem.name ? "contained" : "outlined"}
      size="small"
      color={service() === props.serviceItem.name ? "primary" : "inherit"}
      onClick={async (e) => {
        setService(props.serviceItem.name);
        await fetchSetting();
        await fetchRepositories();
      }}
      sx={{ textTransform: "none" }}
    >
      {props.serviceItem.name}
    </Button>
  );
};