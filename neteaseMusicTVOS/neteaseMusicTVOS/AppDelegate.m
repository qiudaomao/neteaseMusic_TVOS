//
//  AppDelegate.m
//  neteaseMusicTVOS
//

//  Copyright (c) 2016年 zfu. All rights reserved.
//

#import "AppDelegate.h"

// tvBaseURL points to a server on your local machine. To create a local server for testing purposes, use the following command inside your project folder from the Terminal app: ruby -run -ehttpd . -p9001. See NSAppTransportSecurity for information on using a non-secure server.
static NSString *tvBaseURL = @"http://tvos.fuzhuo.me/neteaseMusic_TVOS/server/";
static NSString *tvBootURL = @"http://tvos.fuzhuo.me/neteaseMusic_TVOS/server/netease_music.js";

@interface AppDelegate ()

@end

@implementation AppDelegate

#pragma mark Javascript Execution Helper

- (void)executeRemoteMethod:(NSString *)methodName completion:(void (^)(BOOL))completion {
    [self.appController evaluateInJavaScriptContext:^(JSContext *context) {
        JSValue *appObject = [context objectForKeyedSubscript:@"App"];
        
        if ([appObject hasProperty:methodName]) {
            [appObject invokeMethod:methodName withArguments:@[]];
        }
    } completion:completion];
}

#pragma mark UIApplicationDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    // Create the TVApplicationControllerContext for this application and set the properties that will be passed to the `App.onLaunch` function in JavaScript.
    TVApplicationControllerContext *appControllerContext = [[TVApplicationControllerContext alloc] init];
    
    // The JavaScript URL is used to create the JavaScript context for your TVMLKit application. Although it is possible to separate your JavaScript into separate files, to help reduce the launch time of your application we recommend creating minified and compressed version of this resource. This will allow for the resource to be retrieved and UI presented to the user quickly.
    NSURL *javaScriptURL = [NSURL URLWithString:tvBootURL];
    appControllerContext.javaScriptApplicationURL = javaScriptURL;
    
    NSMutableDictionary *appControllerOptions = [appControllerContext.launchOptions mutableCopy];
    appControllerOptions[@"BASEURL"] = tvBaseURL;
    
    for (NSString *key in launchOptions) {
        appControllerOptions[key] = launchOptions[key];
    }
    appControllerContext.launchOptions = appControllerOptions;
    
    self.appController = [[TVApplicationController alloc] initWithContext:appControllerContext window:self.window delegate:self];

    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    [self executeRemoteMethod:@"onWillResignActive" completion: ^(BOOL success) {
        // ...
    }];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    [self executeRemoteMethod:@"onDidEnterBackground" completion: ^(BOOL success) {
        // ...
    }];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    [self executeRemoteMethod:@"onWillEnterForeground" completion: ^(BOOL success) {
        // ...
    }];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    [self executeRemoteMethod:@"onDidBecomeActive" completion: ^(BOOL success) {
        // ...
    }];
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    [self executeRemoteMethod:@"onWillTerminate" completion: ^(BOOL success) {
        // ...
    }];
}

#pragma mark TVApplicationControllerDelegate

- (void)appController:(TVApplicationController *)appController didFinishLaunchingWithOptions:(nullable NSDictionary<NSString *, id> *)options {
    NSLog(@"appController:didFinishLaunchingWithOptions: invoked with options: %@", options);
}

- (void)appController:(TVApplicationController *)appController didFailWithError:(NSError *)error {
    NSLog(@"appController:didFailWithError: invoked with error: %@", error);
    
    NSString *title = @"Error Launching Application";
    NSString *message = error.localizedDescription;
    UIAlertController *alertController = [UIAlertController  alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleAlert];
    
    [self.appController.navigationController presentViewController:alertController animated:YES completion: ^() {
        // ...
    }];
}

- (void)appController:(TVApplicationController *)appController didStopWithOptions:(nullable NSDictionary<NSString *, id> *)options {
    NSLog(@"appController:didStopWithOptions: invoked with options: %@", options);
}

@end
