<script lang="ts">
  import { goto } from "$app/navigation";

  let phoneNumber = "";
  let otp = "";
  let showOtpInput = false;
  let isLoading = false;
  let errorMessage = "";

  async function requestOTP() {
    if (!phoneNumber) {
      errorMessage = "Please enter your phone number";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      showOtpInput = true;
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unknown error occurred";
      }
    } finally {
      isLoading = false;
    }
  }

  async function verifyOTP() {
    if (!otp) {
      errorMessage = "Please enter the OTP";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Redirect to menu page on successful login
      goto("/menu");
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unknown error occurred";
      }
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <h1>Welcome to Snack Corner</h1>

  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}

  <div class="form">
    <label for="phoneNumber">Phone Number</label>
    <input
      type="tel"
      id="phoneNumber"
      bind:value={phoneNumber}
      placeholder="+910000000000"
      disabled={showOtpInput || isLoading}
    />

    {#if !showOtpInput}
      <button on:click={requestOTP} disabled={isLoading}>
        {isLoading ? "Sending..." : "Get OTP"}
      </button>
    {:else}
      <label for="otp">Enter OTP</label>
      <input
        type="text"
        id="otp"
        bind:value={otp}
        placeholder="6-digit OTP"
        disabled={isLoading}
        maxlength="6"
      />

      <div class="actions">
        <button
          on:click={() => {
            showOtpInput = false;
          }}
          disabled={isLoading}
        >
          Back
        </button>
        <button on:click={verifyOTP} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  label {
    font-weight: 500;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    padding: 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #cccccc;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .error {
    background-color: #ffdddd;
    color: #f44336;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
  }
</style>
