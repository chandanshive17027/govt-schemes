import os
import sys
import json
from prisma import Prisma

# Required fields to check
REQUIRED_FIELDS = [
    "details",
    "benefits",
    "eligibility",
    "application_process",
    "documents_required",
]

async def main():
    db = Prisma()
    await db.connect()

    # Fetch all schemes
    schemes = await db.scheme.find_many()

    updated_count = 0
    for scheme in schemes:
        # Check if all required fields are not None
        if all(getattr(scheme, field) is None for field in REQUIRED_FIELDS):
            if not scheme.detailsfetched:  # Only update if not already true
                await db.scheme.update(
                    where={"id": scheme.id},
                    data={"detailsfetched": False},
                )
                updated_count += 1

    await db.disconnect()
    print(f"✅ Updated {updated_count} schemes with detailsfetched = false")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
