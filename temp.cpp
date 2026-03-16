#include<bits/stdc++.h>
using namespace std;

int  helper(int st,vector<vector<pair<int,int>>>&adj,vector<bool>&visited,int c,vector<vector<int>>&v,int n){
    if(c==1){
        return v[st][0];
    }
    //
    visited[st]=true;
    int ANS=INT_MAX;
    for(int i=0;i<n-1;i++){
        int city=adj[st][i].first;
        if(visited[city]==true) continue;
        //
        visited[city]=true;
        int ans=adj[st][i].second+helper(city,adj,visited,c-1,v,n);
        visited[city]=false;
        ANS=min(ANS,ans);
    }
    return ANS;
}
int main(){
    int n;
    cin>>n;
    vector<vector<int>>v(n,vector<int>(n,0));
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            int x;
            cin>>x;
            v[i][j]=x;
        }
    }
    //
    //1.adj
    vector<vector<pair<int,int>>>adj(n);
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(i==j) continue;
            adj[i].push_back({j,v[i][j]});
        }
    }
    //2. graph
    vector<bool>visited(n,false);
    visited[0]=true;
    int ans=helper(0,adj,visited,n,v,n);
    cout<<ans;

}