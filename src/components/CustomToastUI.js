import React from "react";
import { Box, Flex, Text, CloseButton, Icon } from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

const STATUS_CONFIG = {
  success: { color: "#14a44d", bg: "#f0faf4", icon: FiCheckCircle },
  error:   { color: "#e53e3e", bg: "#fff5f5", icon: FiAlertCircle },
  warning: { color: "#dd6b20", bg: "#fffaf0", icon: FiAlertTriangle },
  info:    { color: "#3182ce", bg: "#ebf8ff", icon: FiInfo },
};

const CustomToastUI = ({ title, description, status = "info", onClose, action }) => {
  const { color, bg, icon } = STATUS_CONFIG[status] || STATUS_CONFIG.info;

  return (
    <Box
      bg="white"
      borderRadius="10px"
      boxShadow="0 4px 20px rgba(0,0,0,0.09)"
      borderLeft={`4px solid ${color}`}
      px={4}
      py={3}
      minW="280px"
      maxW="380px"
    >
      <Flex align="flex-start" gap={3}>
        <Box
          bg={bg}
          borderRadius="full"
          p="6px"
          flexShrink={0}
          mt="1px"
        >
          <Icon as={icon} color={color} boxSize={4} display="block" />
        </Box>

        <Box flex={1} minW={0}>
          {title && (
            <Text fontWeight="700" fontSize="sm" color="gray.800" lineHeight="1.4">
              {title}
            </Text>
          )}
          {description && (
            <Text fontSize="xs" color="gray.500" mt="2px" lineHeight="1.6">
              {description}
            </Text>
          )}
          {action && (
            <Text
              as="button"
              fontSize="xs"
              fontWeight="700"
              color={color}
              mt="6px"
              display="block"
              onClick={() => { action.onClick(); onClose(); }}
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
            >
              {action.label} →
            </Text>
          )}
        </Box>

        <CloseButton size="sm" onClick={onClose} color="gray.400" flexShrink={0} />
      </Flex>
    </Box>
  );
};

export default CustomToastUI;
