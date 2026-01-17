"""
Base Integration Adapter for the BHIV Application Framework
"""

import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

class BaseIntegrationAdapter(ABC):
    """
    Base class for all integration adapters in the BHIV Application Framework.
    
    Adapters are designed to be:
    - Optional: System works without any adapters
    - Pluggable: Can be enabled/disabled via configuration
    - Fail-safe: If an adapter fails, it doesn't break the main system
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the adapter with configuration.
        
        Args:
            config: Dictionary containing adapter configuration
                   Must include 'enabled' key to control activation
        """
        self.config = config
        self.enabled = config.get('enabled', False)
        self.name = config.get('name', self.__class__.__name__)
    
    def execute(self, event: Dict[str, Any]) -> Optional[Any]:
        """
        Execute the adapter logic. This method wraps the internal implementation
        to ensure that adapter failures don't break the main application flow.
        
        Args:
            event: Event data to process
            
        Returns:
            Result of the adapter execution, or None if disabled/failure
        """
        if not self.enabled:
            logger.debug(f"Adapter {self.name} is disabled, skipping execution")
            return None
        
        try:
            logger.info(f"Executing adapter {self.name} for event: {event.get('action', 'unknown')}")
            result = self._execute_internal(event)
            logger.info(f"Adapter {self.name} executed successfully")
            return result
        except Exception as e:
            logger.error(f"Adapter {self.name} failed: {str(e)}", exc_info=True)
            # Don't let adapter failure break the main application flow
            return None
    
    @abstractmethod
    def _execute_internal(self, event: Dict[str, Any]) -> Any:
        """
        Internal method to be implemented by subclasses.
        This is where the actual adapter logic goes.
        
        Args:
            event: Event data to process
            
        Returns:
            Result of the processing
        """
        raise NotImplementedError("Subclasses must implement _execute_internal method")


# Example usage:
# 
# class ArthaAdapter(BaseIntegrationAdapter):
#     def _execute_internal(self, event):
#         # Implementation for Artha integration
#         pass
#
# class KaryaAdapter(BaseIntegrationAdapter):
#     def _execute_internal(self, event):
#         # Implementation for Karya integration
#         pass
#
# class InsightFlowAdapter(BaseIntegrationAdapter):
#     def _execute_internal(self, event):
#         # Implementation for InsightFlow integration
#         pass
#
# class BucketAdapter(BaseIntegrationAdapter):
#     def _execute_internal(self, event):
#         # Implementation for Bucket integration
#         pass