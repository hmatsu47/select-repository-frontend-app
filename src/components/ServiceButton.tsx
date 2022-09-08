import Button from "@suid/material/Button";
import { fetchRepositories } from "../api/fetchRepositories";
import { fetchSetting } from "../api/fetchSetting";
import { service, setRepository, setService } from "../signal";
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
        // 選択肢をローカルストレージに記録しておく
        localStorage.setItem("selectedService", props.serviceItem.name);
        await fetchSetting();
        await fetchRepositories();
        // ローカルストレージから前回のリポジトリの選択肢を（サービス別で）読み取る
        const tmpRepository = localStorage.getItem(
          `selectedRepository-${props.serviceItem.name}`
        );
        if (tmpRepository) {
          setRepository(tmpRepository);
        }
      }}
      sx={{ textTransform: "none" }}
      title={`${props.serviceItem.name} を選択`}
    >
      {props.serviceItem.name}
    </Button>
  );
};
