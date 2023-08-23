<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use mysqli;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Exception;

class AuthController extends Controller
{
   
    public function login(Request $request){ 
        $this->checkTooManyFailedAttempts();
        $loginData = array(
            'email' => $request->email, 
            'password' => $request->password
        ); 

        if (!auth()->attempt($loginData)) {
            RateLimiter::hit($this->throttleKey(), $seconds = 3600);
            return response(['message' => 'Invalid Credentials'], 403);
        }
        
        RateLimiter::clear($this->throttleKey());
        $accessToken = auth()->user()->createToken('authToken')->accessToken;
        return response(['user' => auth()->user(), 'access_token' => $accessToken], 200);
    }

     /**
     * Get the rate limiting throttle key for the request.
     *
     * @return string
     */
    public function throttleKey()
    {
        return Str::lower(request('email')) . '|' . request()->ip();
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @return void
     */
    public function checkTooManyFailedAttempts()
    {  
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 3)) {
            return;
        }

        throw new Exception('IP address banned. Too many login attempts.');
    }

   

    
}
