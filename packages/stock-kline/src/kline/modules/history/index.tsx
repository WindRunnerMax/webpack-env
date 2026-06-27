import "./index.less";

import { Button, Modal } from "@arco-design/web-react";
import { IconHistory } from "@arco-design/web-react/icon";
import { Storage } from "@block-kit/utils";
import type { FC } from "react";
import { Fragment, useMemo, useState } from "react";

import { HISTORY_KEY } from "../../utils/storage";

type ListItem = { label: string; value: string };

export const History: FC<{
  onSetCode: (code: string) => void;
}> = props => {
  const [visible, setVisible] = useState(false);

  const list = useMemo(() => {
    return visible ? Storage.local.get<ListItem[]>(HISTORY_KEY) || [] : [];
  }, [visible]);

  return (
    <Fragment>
      <Modal
        className="history-modal"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={false}
        footer={null}
      >
        <div className="stock-list-container">
          {list.map(item => (
            <div
              className="stock-item"
              key={item.value}
              onClick={() => props.onSetCode(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </Modal>
      <Button
        size="small"
        type="primary"
        icon={<IconHistory />}
        iconOnly
        onClick={() => setVisible(true)}
      ></Button>
    </Fragment>
  );
};
