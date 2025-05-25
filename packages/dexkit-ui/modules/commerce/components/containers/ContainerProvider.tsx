import { useCallback, useState } from "react";
import { ContainerContext } from "./ContainerContext";

export interface ContainerProviderProps {
  children: (id: string) => React.ReactNode;
  containerId: string;
  onActiveMenu: (activeMenu: string) => void;
}

export default function ContainerProvider({
  children,
  containerId,
  onActiveMenu,
}: ContainerProviderProps) {
  const [params, setParams] = useState<{ [key: string]: string }>({});

  const [currContainerId, setContainerId] = useState(containerId);

  const [history, setHistory] = useState<
    { containerId: string; params?: { [key: string]: string } }[]
  >([]);

  const handleGet = useCallback(
    (key: string) => {
      return params[key];
    },
    [params]
  );

  const handleSet = useCallback(
    (key: string, value: string) => {
      setParams((params) => {
        params[key] = value;
        return params;
      });
    },
    [params]
  );

  const handleSetContainer = useCallback(
    (
      containerId: string,
      params?: { [key: string]: string },
      options?: { activeMenu?: boolean }
    ) => {
      setContainerId(containerId);

      if (params) {
        setParams(params);
      }

      if (options?.activeMenu) {
        onActiveMenu(containerId);
      }

      setHistory((history) => [...history, { containerId, params }]);
    },
    []
  );

  const handleGoBack = useCallback(() => {
    setHistory((history) => {
      const historyCopy = [...history];
      const container = historyCopy.pop();

      if (container) {
        setContainerId(containerId);
        if (params) {
          setParams(params);
        }

        return historyCopy;
      }

      return historyCopy;
    });
  }, []);

  return (
    <ContainerContext.Provider
      value={{
        get: handleGet,
        set: handleSet,
        setContainer: handleSetContainer,
        params,
        containerId: currContainerId,
        goBack: handleGoBack,
      }}
    >
      {children(currContainerId)}
    </ContainerContext.Provider>
  );
}
