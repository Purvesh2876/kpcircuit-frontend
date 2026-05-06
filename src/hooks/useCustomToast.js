import { useToast } from "@chakra-ui/react";
import React from "react";
import CustomToastUI from "../components/CustomToastUI";

export function useCustomToast() {
  const toast = useToast();

  return ({
    title,
    description,
    status = "info",
    duration = 3000,
    isClosable = true,
    position = "bottom-right",
    action,
    ...rest
  }) => {
    toast({
      position,
      duration,
      isClosable,
      render: ({ onClose }) => (
        <CustomToastUI
          title={title}
          description={description}
          status={status}
          onClose={onClose}
          action={action}
        />
      ),
      ...rest,
    });
  };
}
