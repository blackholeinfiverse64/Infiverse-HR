# Reusability Guide

## Making the Framework Generic

### Before (HR-Specific):
```python
class LeaveApprovalWorkflow:
    def start_leave_approval(self, leave_id):
        leave = get_leave_request(leave_id)
        manager = get_manager(leave.employee_id)
        create_approval_task(manager, leave)
```

### After (Generic, Reusable):
```python
class DocumentApprovalWorkflow:
    def start_approval(self, document_id, document_type, approvers):
        document = get_document(document_id, document_type)
        for approver in approvers:
            create_approval_task(approver, document)

# HR uses it
workflow.start_approval('leave_123', 'leave_request', [manager])

# CRM uses it (same code!)
workflow.start_approval('quote_456', 'quote', [sales_manager])

# ERP uses it (same code!)
workflow.start_approval('po_789', 'purchase_order', [finance_head])
```

## AI/RL Integration Pattern

### Before (Static Logic):
```python
class ApprovalWorkflow:
    def make_decision(self, request):
        if request.score > 70:
            return 'approve'
        else:
            return 'reject'
```

### After (AI/RL Enhanced):
```python
class IntelligentApprovalWorkflow:
    def make_decision(self, request):
        # Use AI service for intelligent decision making
        ai_response = ai_service.analyze_request(request)
        
        # Apply reinforcement learning for continuous improvement
        rl_decision = rl_service.get_optimized_decision(ai_response)
        
        # Fallback to static logic if AI/RL services unavailable
        if not rl_decision:
            return self.fallback_decision(request)
        
        # Log decision for RL feedback loop
        rl_service.log_decision_outcome(rl_decision, request.result)
        
        return rl_decision

# HR uses it
workflow.make_decision(leave_request)

# CRM uses it (same AI/RL integration!)
workflow.make_decision(quote_request)

# ERP uses it (same AI/RL integration!)
workflow.make_decision(po_request)
```

## How to Add New Modules
1. Create a new module directory in `/modules/`
2. Follow the same interface patterns as existing modules
3. Use the shared services from `/runtime-core/`
4. Ensure tenant isolation is maintained
5. Implement AI/RL integration hooks where intelligent automation is needed
6. Use the adapter pattern for optional AI/RL service integration
7. Maintain backward compatibility when AI/RL services are unavailable

---

**Created:** January 10, 2026  
**Status:** Template created, needs detailed examples