import { test, expect } from '@playwright/test';

test('Cart quantity label matches sum quantities of items in cart.', async ({ page }) => {
    
    /**
     * Prerequisite actions
     * 
     * 1) Navigate to page
     */
    await page.goto('https://react-shopping-cart-67954.firebaseapp.com');

    /**
     * 2) Add items to cart 
     * (This opens the cart)
     */
    const item1ButtonClass = '.sc-124al1g-2.dwOYCh';
    const item2ButtonClass = '.sc-124al1g-2.bCLaRj';

    // Click 'Add to cart' buttons
    for (let i = 0; i < 2; i++) {
        await page.locator(item1ButtonClass).getByRole("button").click();
    }
    for (let i = 0; i < 3; i++) {
        await page.locator(item2ButtonClass).getByRole("button").click();

    }

    /**
     * Main Steps
     * 
     * 1) Record the quantity on the cart label
     */
    const quantityLabelClass = '.sc-1h98xa9-3.VLMSP';
    const quantityLabelString = (await page.locator(quantityLabelClass).textContent()) ?? "";
    const quantityLabelValue = parseInt(quantityLabelString);

    /**
     * 2) Sum the quantities of all items in the cart.
     */
    const itemDescriptionClass = '.sc-11uohgb-3.gKtloF';
    const cartDescriptions = page.locator(itemDescriptionClass);

    const uniqueCartItemCount = await cartDescriptions.count();
    let cartQuantity = 0;
    //Iterate through cart items, extract quantity in cart from description string and add to sum
    for (let i = 0; i < uniqueCartItemCount; i++) {
        const descString = await cartDescriptions.nth(i).textContent();
        cartQuantity += extractCartItemQuantity(descString);
    }
    
    /**
     * 3) Compare recorded quantity to the sum found in Step 2.
     */
    expect(quantityLabelValue).toBe(cartQuantity);
});

/**
 * 
 * @param descString An item description string from the cart
 * @returns the quantity of that item in the cart
 */
function extractCartItemQuantity(descString: string | null): number {
    if (descString != null) {
        const stringParts = descString.split(" Quantity: ");
        if (stringParts.length >= 1) {
            const num = stringParts[1].trim();
            return parseInt(num, 10);
        }
    }
    return 0;
}