"""
Adapter Manager for the BHIV Application Framework

This module provides a centralized way to manage and execute all integration adapters.
"""

import logging
from typing import Dict, List, Any
from .adapters import get_all_adapters
from .adapters.base_adapter import BaseIntegrationAdapter

logger = logging.getLogger(__name__)

class AdapterManager:
    """
    Manages all integration adapters for the BHIV Application Framework.
    
    The AdapterManager allows for:
    - Dynamic loading of adapters
    - Centralized execution of adapters
    - Configuration management
    - Error handling across all adapters
    """
    
    def __init__(self, adapter_configs: Dict[str, Dict[str, Any]] = None):
        """
        Initialize the AdapterManager with adapter configurations.
        
        Args:
            adapter_configs: Dictionary mapping adapter names to their configurations
                           If None, all adapters will be initialized as disabled
        """
        self.adapters: Dict[str, BaseIntegrationAdapter] = {}
        self.adapter_configs = adapter_configs or {}
        
        # Load all available adapters
        available_adapters = get_all_adapters()
        
        for adapter_name, adapter_class in available_adapters.items():
            # Get configuration for this adapter, default to disabled if not specified
            config = self.adapter_configs.get(adapter_name, {
                "name": f"{adapter_name.title()} Adapter",
                "enabled": False
            })
            config['name'] = config.get('name', f"{adapter_name.title()} Adapter")
            
            # Initialize the adapter
            adapter_instance = adapter_class(config)
            self.adapters[adapter_name] = adapter_instance
            
            logger.info(f"Initialized adapter: {adapter_name} (enabled: {adapter_instance.enabled})")
    
    def execute_all_adapters(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute all registered adapters with the given event.
        
        Args:
            event: Event data to process by all adapters
            
        Returns:
            Dictionary containing results from all adapters
        """
        results = {}
        
        for adapter_name, adapter in self.adapters.items():
            try:
                result = adapter.execute(event)
                results[adapter_name] = result
            except Exception as e:
                logger.error(f"Error executing {adapter_name}: {str(e)}", exc_info=True)
                results[adapter_name] = {"error": str(e), "success": False}
        
        return results
    
    def execute_adapter(self, adapter_name: str, event: Dict[str, Any]) -> Any:
        """
        Execute a specific adapter with the given event.
        
        Args:
            adapter_name: Name of the adapter to execute
            event: Event data to process
            
        Returns:
            Result from the adapter execution
        """
        if adapter_name not in self.adapters:
            logger.warning(f"Adapter {adapter_name} not found")
            return None
        
        adapter = self.adapters[adapter_name]
        return adapter.execute(event)
    
    def get_active_adapters(self) -> List[str]:
        """
        Get a list of all currently active (enabled) adapters.
        
        Returns:
            List of adapter names that are currently enabled
        """
        return [name for name, adapter in self.adapters.items() if adapter.enabled]
    
    def toggle_adapter(self, adapter_name: str, enabled: bool) -> bool:
        """
        Enable or disable an adapter at runtime.
        
        Args:
            adapter_name: Name of the adapter to toggle
            enabled: Whether to enable or disable the adapter
            
        Returns:
            True if the adapter was found and toggled, False otherwise
        """
        if adapter_name not in self.adapters:
            logger.warning(f"Cannot toggle {adapter_name}: adapter not found")
            return False
        
        self.adapters[adapter_name].enabled = enabled
        logger.info(f"Toggled {adapter_name} to {'enabled' if enabled else 'disabled'}")
        return True


# Example usage:
# 
# if __name__ == "__main__":
#     # Example configuration
#     configs = {
#         'artha': {
#             "name": "Artha Adapter",
#             "enabled": True,
#             "artha_api_url": "https://artha-api.example.com",
#             "artha_api_key": "your-key"
#         },
#         'karya': {
#             "name": "Karya Adapter", 
#             "enabled": True,
#             "karya_api_url": "https://karya-api.example.com",
#             "karya_api_key": "your-key"
#         }
#     }
#     
#     # Initialize manager
#     manager = AdapterManager(configs)
#     
#     # Example event
#     event = {
#         "event_id": "evt_123",
#         "action": "payroll_processed",
#         "tenant_id": "tenant_abc", 
#         "user_id": "user_123",
#         "timestamp": "2026-01-10T17:00:00Z"
#     }
#     
#     # Execute all adapters
#     results = manager.execute_all_adapters(event)
#     print(results)