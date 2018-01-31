<?php

namespace App\Http\Middleware;

use Closure;

class CheckAdminLogin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $admin = $request->session()->exists('admin');
        if(!$admin) {
            //return view('index');
            //return redirect('admin/login');
        }

        return $next($request);
    }
}
