import pytest
from app.core.rate_limit import InMemoryRateLimiter

def test_rate_limiter_exceeded():
    test_limiter = InMemoryRateLimiter(limit_per_minute=5)
    test_id = "test-user-ip-123"

    # First 5 calls pass
    for _ in range(5):
        assert test_limiter.is_rate_limited(test_id) is False

    # 6th call should be rate limited
    assert test_limiter.is_rate_limited(test_id) is True
