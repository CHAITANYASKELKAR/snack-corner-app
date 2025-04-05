<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { cartStore } from '$lib/stores/cart';
    import type { MenuItem } from '$lib/types';
    
    export let data;
    
    let categories = data.categories;
    let menuItems: MenuItem[] = [];
    let activeCategory = categories.length > 0 ? categories[0] : null;
    let isLoading = true;
    
    $: cart = $cartStore;
    
    onMount(async () => {
      if (activeCategory) {
        await loadMenuItems(activeCategory);
      }
    });
    
    async function loadMenuItems(category: { id: string, name: string }) {
      try {
        isLoading = true;
        activeCategory = category;
        
        const response = await fetch(`/api/menu/category/${category.id}`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        
        menuItems = await response.json();
      } catch (error) {
        console.error(`Error loading items for category ${category.id}:`, error);
      } finally {
        isLoading = false;
      }
    }
    
    function addToCart(item: MenuItem) {
      cartStore.addItem(item);
    }
    
    function removeFromCart(itemId: string) {
      cartStore.removeItem(itemId);
    }
    
    function getTotalAmount() {
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function proceedToCheckout() {
      if (cart.length > 0) {
        goto('/checkout');
      }
    }
  </script>
  
  <div class="menu-container">
    <h1>Menu</h1>
    
    {#if isLoading && categories.length === 0}
      <div class="loading">Loading menu...</div>
    {:else}
      <div class="categories">
        {#each categories as category}
          <button 
            class:active={activeCategory && activeCategory.id === category.id} 
            on:click={() => loadMenuItems(category)}
          >
            {category.name}
          </button>
        {/each}
      </div>
      
      <div class="menu-items">
        {#if isLoading}
          <div class="loading">Loading items...</div>
        {:else if menuItems.length === 0}
          <div class="empty-state">No items available in this category</div>
        {:else}
          {#each menuItems as item}
            <div class="menu-item">
              {#if item.imageUrl}
                <img src={item.imageUrl} alt={item.name} />
              {:else}
                <div class="placeholder-image"></div>
              {/if}
              
              <div class="item-details">
                <h3>{item.name}</h3>
                <p>{item.description || ''}</p>
                <p class="price">₹{item.price.toFixed(2)}</p>
              </div>
              
              <button class="add-button" on:click={() => addToCart(item)}>
                Add +
              </button>
            </div>
          {/each}
        {/if}
      </div>
      
      {#if cart.length > 0}
        <div class="cart-summary">
          <h2>Your Order ({cart.reduce((total, item) => total + item.quantity, 0)} items)</h2>
          <div class="cart-items">
            {#each cart as item}
              <div class="cart-item">
                <span>{item.name}</span>
                <div class="quantity-control">
                  <button on:click={() => removeFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button on:click={() => addToCart(item)}>+</button>
                </div>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            {/each}
          </div>
          
          <div class="cart-total">
            <span>Total Amount:</span>
            <span>₹{getTotalAmount().toFixed(2)}</span>
          </div>
          
          <button class="checkout-button" on:click={proceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      {/if}
    {/if}
  </div>
  
  <style>
    .menu-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      margin-bottom: 20px;
    }