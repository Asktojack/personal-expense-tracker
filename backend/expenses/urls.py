
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    TransactionListCreateView,
    TransactionDetailView,
    UserRegistrationView,
    DashboardSummaryView,
    CategorySummaryView,
    MonthlyExpenseSummaryView,
    MonthlyBudgetListCreateView,
    MonthlyBudgetDetailView
)

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', obtain_auth_token, name='user-login'),

    # Transactions
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),

    # Dashboard and Reports
    path('dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('category-summary/', CategorySummaryView.as_view(), name='category-summary'),
    path('monthly-summary/', MonthlyExpenseSummaryView.as_view(), name='monthly-summary'),

    # Monthly Budget
    path('budgets/', MonthlyBudgetListCreateView.as_view(), name='budget-list-create'),

    path('budgets/<int:pk>/', MonthlyBudgetDetailView.as_view(), name='budget-detail'),
]
